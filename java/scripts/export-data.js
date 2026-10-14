#!/usr/bin/env node
/**
 * Copies data tables from the JS source into Java resources, so both libraries use the same list.
 * Run from the satpam repo root whenever src/data changes:
 *
 *   node java/scripts/export-data.js
 */
const fs = require('fs');
const path = require('path');

const RESOURCES_DIR = path.join(__dirname, '../satpam-core/src/main/resources/com/cermati/satpam/data');

const disposableEmails = require('../../src/data/disposable-email-list');

fs.mkdirSync(RESOURCES_DIR, { recursive: true });
fs.writeFileSync(path.join(RESOURCES_DIR, 'disposable-email-domains.txt'), disposableEmails.join('\n') + '\n');

console.log(`${disposableEmails.length} disposable email domains`);
