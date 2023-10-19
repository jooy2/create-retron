#!/usr/bin/env node
import { spawn } from 'child_process';
import { existsSync, rmSync, statSync } from 'fs';
import { join } from 'path';

const PKG_NAME = 'retron';
const PKG_AUTHOR = 'jooy2';

async function run(): Promise<void> {
	const clone = async (): Promise<number> =>
		new Promise((resolve, reject) => {
			try {
				spawn(
					'git',
					['clone', `https://github.com/${PKG_AUTHOR}/${PKG_NAME}`, PKG_NAME, '--depth', '1'],
					{ stdio: 'inherit' }
				)
					.on('error', (err) => {
						reject(err);
					})
					.on('exit', (code) => {
						resolve(code);
					});
			} catch (e) {
				reject(e);
			}
		});

	const installModules = async (): Promise<number> =>
		new Promise((resolve, reject) => {
			try {
				const npmCommand = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';
				spawn(npmCommand, ['install'], { stdio: 'inherit', cwd: join(process.cwd(), PKG_NAME) })
					.on('error', (err) => {
						reject(err);
					})
					.on('exit', (code) => {
						resolve(code);
					});
			} catch (e) {
				reject(e);
			}
		});

	try {
		if (existsSync(PKG_NAME) && statSync(PKG_NAME).isDirectory()) {
			console.error(`Failed: Directory "${PKG_NAME}" already exists.`);
			process.exit(1);
			return;
		}

		await clone();

		// Remove files used only in git repositories
		rmSync(join(process.cwd(), PKG_NAME, '.git'), { recursive: true, force: true });
		rmSync(join(process.cwd(), PKG_NAME, '.github'), { recursive: true, force: true });

		await installModules();
	} catch (e) {
		console.error(e?.message);
		process.exit(1);
	}
}

run();
