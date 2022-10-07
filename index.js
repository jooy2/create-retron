#!/usr/bin/env node
import { spawn } from 'child_process';
import { existsSync, rmSync, statSync } from 'fs';
import { join } from 'path';

const packageName = 'retron';

async function run() {
  const clone = async () => new Promise((resolve, reject) => {
    try {
      spawn('git', ['clone', `https://github.com/jooy2/${packageName}`, packageName, '--depth', '1'], { stdio: 'inherit' })
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
    if (existsSync(packageName) && statSync(packageName).isDirectory()) {
      console.error(`Failed: Directory "${packageName}" already exists.`);
      process.exit(1);
      return;
    }

    await clone();

    rmSync(join(process.cwd(), packageName, '.git'), { recursive: true, force: true });
  } catch (e) {
    console.error(e?.message);
    process.exit(1);
  }
}

run();
