// To do live reloading 
import livereload from "rollup-plugin-livereload";
// To be able to use the import syntax
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// Load css from js
import css from 'rollup-plugin-css-only';
// Minify generated bundle
import { terser } from "rollup-plugin-terser";
// To be able to use process.env in the browser
import rollupPluginInjectProcessEnv from "rollup-plugin-inject-process-env";
import svelte from "rollup-plugin-svelte";
import preprocess from "svelte-preprocess";


// Check with ENV var if we are building for production (aka npm run build)
// It does so by checking the "-w" flag in "rollup -c -w"
const production = !process.env.ROLLUP_WATCH;

// Re-runs the "npm run start" command on new changes using the "child_process" library
// Meaning, is just a fancy way to use the console directly with js. No need to understand this that much
function serve() {
    let server;
    function toExit() {
        if (server) server.kill(0);
    }

    return {
        writeBundle() {
            if (server) return;
            // Spawn a child server process using the "npm start command", that uses the "sirv cli" package for an easy web server
            server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                stdio: ['ignore', 'inherit', 'inherit'],
                shell: true
            });
            // kill the server on exit
            process.on('SIGTERM', toExit);
            process.on('exit', toExit);
        }
    };
}

export default {
    input: "src/main.js",
    output: {
        file: "public/build/bundle.js",
        format: "iife",
        name: "app",
        sourcemap: "inline"
    },
    plugins: [
        svelte({
            compilerOptions: { dev: !production},
            preprocess : preprocess()
        }),
        // Put the css output in a separate file
        css({ output: "bundle.css" }),
        // The two plugins to load ES6 modules
        resolve({ browser: true }),
        commonjs(),

        // Inject the production env var into the browser for easier debugging
        rollupPluginInjectProcessEnv({
            PRODUCTION: production
        }),
        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser()
    ],
    watch: {
        clearScreen: false
    }
}