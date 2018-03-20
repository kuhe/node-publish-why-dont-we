#!/usr/bin/env node

/**
 *
 * Using the process working directory's package.json version,
 * tag and/org npm publish that version only if such version
 * is not already tagged/published.
 *
 * Can be none, one, or both.
 *
 */

const clapi = require('node-clapi');
const path = require('path');

function toString(stdout) {
    return (Array.isArray(stdout) ? stdout : [stdout]).join('\n').replace('\\t', '    ');
}
function log(...args) {
    return console.log(toString(...args));
}

(async () => {

    const git = new clapi('git');
    const npm = new clapi('npm');

    console.log('Publish why don\'t we...');

    const pkg = require(path.join(process.cwd(), 'package.json'));

    let prospectiveVersion;

    if (Array.from(process.argv).indexOf('--use-latest-local-tag') > -1) {
        log('Using latest local tag');
        prospectiveVersion = (await git.describe('--tags', '--abbrev=0'))[0];
    } else {
        log('Using package.json version');
        prospectiveVersion = pkg.version;
    }

    console.log('Prospective version', pkg.name, prospectiveVersion);

    try {
        var tags = await git['ls-remote']('--tags', 'origin', prospectiveVersion);
    } catch (e) {
        return console.error(toString(e));
    }

    if (tags.length) {
        log('Tag exists, not pushing.');
    } else {
        log('Making new tag.');
        try {
            log(await git.tag(prospectiveVersion));
            log(await git.push('--tags'));
        } catch(e) {
            log(e);
        }
    }

    try {
        var npmVersion = await npm.info(`${pkg.name}@${prospectiveVersion}`);
    } catch (e) {
        if (!toString(e).includes('is not in the npm registry')) {
            return console.error(toString(e));
        }
        npmVersion = [];
    }

    if (npmVersion.length) {
        log('Npm version exists, not publishing.');
    } else {
        log('Publishing new version.');
        try {
            log(await npm.version('--no-git-tag-version', '--allow-same-version', prospectiveVersion));
            log(await npm.get('registry'));
            log(await npm.publish('--access', 'public'));
        } catch (e) {
            log(e);
        }
    }

})();
