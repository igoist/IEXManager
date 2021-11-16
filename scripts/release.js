const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const sass = require('node-sass');

// ========= 方法定义区域(之后可以迁移到单独文件)
const execCommand = (arr) =>
  (Array.isArray(arr) ? arr : [arr]).forEach((c) => {
    console.log(`task: ${c}...`);
    console.log(child_process.execSync(c).toString('utf8'));
  });

const returnPath = (pathStr) => `${path.resolve(__dirname, pathStr)}`;

const rmExist = (tasks, pathStr) => {
  const targetPath = returnPath(pathStr);

  if (fs.existsSync(targetPath)) {
    tasks.push(`rm -r ${targetPath}`);
  }
};

const newTask = (fn) => () => new Promise((resolve) => fn(resolve));
// ========= 方法定义区域(之后可以迁移到单独文件)

const pathDist = returnPath('../dist');
const pathManifest = returnPath('../manifest.json');
// const pathIndependent = returnPath('../src/independent');
const pathLocales = returnPath('../src/_locales');
const pathImg = returnPath('../public/img');
const pathPages = returnPath('../public/pages/*');
const pathCSS = returnPath('../public/css');

// task 00 - sass -> css
const task00 = newTask((resolve) => {
  const dirPath = returnPath(`../public/css`);

  const sassArr = ['IDemo', 'IDemo2'];

  let checkArr = [];

  for (let i = 0; i < sassArr.length; i++) checkArr[i] = 0;

  const checkFn = (index) => {
    checkArr[index] = 1;

    let r = checkArr.filter((item) => item === 0);

    console.log('checkFn: ', r.length, r);

    if (!r.length) {
      resolve(true);
    }
  };

  sassArr.map((item, index) => {
    const outputPath = `${dirPath}/${item}.css`;

    const sassOptions = {
      file: returnPath(`../public/sass/${item}.scss`),
      outFile: outputPath,
    };

    sass.render(sassOptions, (err, result) => {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }

      fs.writeFile(outputPath, result.css, () => {
        checkFn(index);
      });
    });
  });
});

// webpack bundle js & inject html
const task01 = newTask((resolve) => {
  const tasks = [];

  tasks.push(`NODE_ENV=production npm run build:dll`);

  tasks.push(`NODE_ENV=production npm run build`);

  execCommand(tasks);

  resolve(true);
});

/**
 * cp manifest.json dist
 * cp -r src/independent dist
 * cp -r public/img dist
 * cp -r public/pages/* dist
 * cp -r public/css dist
 */
const task02 = newTask((resolve) => {
  const tasks = [];

  const updateManifest = () => {
    tasks.push(`cp ${pathManifest} ${pathDist}`);
  };

  // const updateIndependent = () => {
  //   rmExist(tasks, '../dist/independent');
  //   tasks.push(`cp -r ${pathIndependent} ${pathDist}`);
  // };

  const updateLocales = () => {
    rmExist(tasks, '../dist/_locales');
    tasks.push(`cp -r ${pathLocales} ${pathDist}`);
  };

  const updateImg = () => {
    rmExist(tasks, '../dist/img');
    tasks.push(`cp -r ${pathImg} ${pathDist}`);
  };

  const updatePages = () => {
    rmExist(tasks, '../dist/*.html');
    tasks.push(`cp -r ${pathPages} ${pathDist}`);
  };

  const updateCSS = () => {
    rmExist(tasks, '../dist/css');
    tasks.push(`cp -r ${pathCSS} ${pathDist}`);
  };

  updateManifest();
  // updateIndependent();
  updateLocales();
  updateImg();
  updatePages();
  updateCSS();

  execCommand(tasks);

  resolve(true);
});

const taskArr = [
  // sass -> css
  task00,
  // webpack bundle js & inject html
  task01,
  // copy
  task02,
];

(async () => {
  for (let i = 0; i < taskArr.length; i++) {
    await taskArr[i]();
  }
})();
