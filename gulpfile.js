const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const browserSync = require('browser-sync').create();

// ---------------------------------------------
// 1. Generate root index.html
// ---------------------------------------------
function generateRootIndex(cb) {
	const baseDir = './';
	const collectedDirs = [];

	// Only scan immediate children of root
	const items = fs.readdirSync(baseDir);

	items.forEach((item) => {
		const fullPath = path.join(baseDir, item);

		if (fs.statSync(fullPath).isDirectory()) {
			const subItems = fs.readdirSync(fullPath);

			if (subItems.includes('index.html')) {
				collectedDirs.push(item); // parent directory name only
			}
		}
	});

	const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
</head>
<body>
  <ul>
    ${collectedDirs.map((dir) => `<li><a href="./${dir}/index.html">${dir}</a></li>`).join('\n    ')}
  </ul>
</body>
</html>`;

	fs.writeFileSync(path.join(baseDir, 'index.html'), htmlContent, 'utf8');
	console.log('✅ Root index.html created with links:', collectedDirs);

	cb();
}

// ---------------------------------------------
// 2. Start BrowserSync server
// ---------------------------------------------
function serve() {
	browserSync.init({
		server: {
			baseDir: './', // root folder
		},
		notify: false, // no popup in browser
		open: true, // auto-open browser
	});

	// Watch for changes
	gulp.watch(['**/*.html'], gulp.series(generateRootIndex, reloadHtml));
	gulp.watch(['**/*.js']).on('change', browserSync.reload);
	gulp.watch(['**/*.css', '**/*.scss'], injectCss);
}

// ---------------------------------------------
// 3. Reload helpers
// ---------------------------------------------
function reloadHtml(cb) {
	browserSync.reload();
	cb();
}

function injectCss(cb) {
	browserSync.reload('*.css'); // inject CSS without full reload
	cb();
}

// ---------------------------------------------
// 4. Default task
// ---------------------------------------------
exports.default = gulp.series(generateRootIndex, serve);
