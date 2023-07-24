/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");

module.exports = {
    packagerConfig: {
        name: "Yomikiru",
    },
    plugins: [
        {
            name: "@electron-forge/plugin-webpack",
            config: {
                mainConfig: "./webpack/main.webpack.js",
                devContentSecurityPolicy: "connect-src 'self' * 'unsafe-eval'",
                renderer: {
                    config: "./webpack/renderer.webpack.js",
                    entryPoints: [
                        {
                            html: "./public/index.html",
                            js: "./src/index.tsx",
                            name: "home",
                        },
                        {
                            html: "./public/download-progress.html",
                            js: "./public/download-progress.js",
                            name: "download_progress",
                        },
                    ],
                },
            },
        },
    ],
    makers: [
        {
            name: "@electron-forge/maker-squirrel",
            platforms: ["win32"],
            // config: {
            // name: "Yomikiru",
            // exe: "Yomikiru.exe",
            // setupExe: `${packageJSON.name}_${packageJSON.version}_windows-setup.exe`,
            // },
        },
        {
            name: "@electron-forge/maker-deb",
            platforms: ["linux"],
            config: {
                options: {
                    maintainer: "mienaiyami",
                    homepage: "https://github.com/mienaiyami/yomikiru",
                    bin: "./Yomikiru",
                    depends: ["unzip", "xdg-utils"],
                },
            },
        },
        {
            name: "@electron-forge/maker-zip",
            platforms: ["win32"],
        },
    ],
    hooks: {
        postMake: (config, makeResults) => {
            // fs.writeFileSync("./test.json", JSON.stringify(makeResults, null, "\t"));
            if (!fs.existsSync("./out/full")) fs.mkdirSync("./out/full");
            let downloadBtns = `## Downloads\n\n`;
            // makeResults.forEach((result) => {
            // result.artifacts.forEach((e) => {
            // if (path.extname(e) === ".zip") {

            // makeResults.forEach(result=>{
            //     if(result.platform==="win32"){
            //         if(result.arch==="ia32"){
            //             //zip
            //             if(result.artifacts.length===1){

            //             }
            //         }
            //     }
            // })
            if (
                fs.existsSync(
                    `./out/make/squirrel.windows/x64/Yomikiru-${makeResults[0].packageJSON.version} Setup.exe`
                )
            )
                fs.renameSync(
                    `./out/make/squirrel.windows/x64/Yomikiru-${makeResults[0].packageJSON.version} Setup.exe`,
                    `./out/full/Yomikiru-v${makeResults[0].packageJSON.version}-Setup-x64.exe`
                );
            downloadBtns += `[![Download 64-bit Setup](https://img.shields.io/badge/Windows%2064--bit%20Setup%20(exe)-Yomikiru--v${makeResults[0].packageJSON.version}--Setup--x64.exe-brightgreen?logo=windows&logoColor=blue)](https://github.com/mienaiyami/yomikiru/releases/download/v${makeResults[0].packageJSON.version}/Yomikiru-v${makeResults[0].packageJSON.version}-Setup-x64.exe)\n`;

            if (
                fs.existsSync(
                    `./out/make/zip/win32/x64/Yomikiru-win32-x64-${makeResults[0].packageJSON.version}.zip`
                )
            )
                fs.renameSync(
                    `./out/make/zip/win32/x64/Yomikiru-win32-x64-${makeResults[0].packageJSON.version}.zip`,
                    `./out/full/Yomikiru-win32-v${makeResults[0].packageJSON.version}-Portable-x64.zip`
                );
            downloadBtns += `[![Download 64-bit Portable](https://img.shields.io/badge/Windows%2064--bit%20Portable%20(zip)-Yomikiru--win32--v${makeResults[0].packageJSON.version}--Portable--x64.zip-brightgreen?logo=windows&logoColor=blue)](https://github.com/mienaiyami/yomikiru/releases/download/v${makeResults[0].packageJSON.version}/Yomikiru-win32-v${makeResults[0].packageJSON.version}-Portable-x64.zip)\n`;
            if (
                fs.existsSync(
                    `./out/make/squirrel.windows/ia32/Yomikiru-${makeResults[0].packageJSON.version} Setup.exe`
                )
            )
                fs.renameSync(
                    `./out/make/squirrel.windows/ia32/Yomikiru-${makeResults[0].packageJSON.version} Setup.exe`,
                    `./out/full/Yomikiru-v${makeResults[0].packageJSON.version}-Setup.exe`
                );
            downloadBtns += `[![Download 32-bit Setup](https://img.shields.io/badge/Windows%2032--bit%20Setup%20(exe)-Yomikiru--v${makeResults[0].packageJSON.version}--Setup.exe-brightgreen?logo=windows&logoColor=blue)](https://github.com/mienaiyami/yomikiru/releases/download/v${makeResults[0].packageJSON.version}/Yomikiru-v${makeResults[0].packageJSON.version}-Setup.exe)\n`;

            if (
                fs.existsSync(
                    `./out/make/zip/win32/ia32/Yomikiru-win32-ia32-${makeResults[0].packageJSON.version}.zip`
                )
            )
                fs.renameSync(
                    `./out/make/zip/win32/ia32/Yomikiru-win32-ia32-${makeResults[0].packageJSON.version}.zip`,
                    `./out/full/Yomikiru-win32-v${makeResults[0].packageJSON.version}-Portable.zip`
                );
            downloadBtns += `[![Download 32-bit Portable](https://img.shields.io/badge/Windows%2032--bit%20Portable%20(zip)-Yomikiru--win32--v${makeResults[0].packageJSON.version}--Portable.zip-brightgreen?logo=windows&logoColor=blue)](https://github.com/mienaiyami/yomikiru/releases/download/v${makeResults[0].packageJSON.version}/Yomikiru-win32-v${makeResults[0].packageJSON.version}-Portable.zip)\n`;
            if (fs.existsSync(`./out/make/deb/x64/yomikiru_${makeResults[0].packageJSON.version}_amd64.deb`))
                fs.renameSync(
                    `./out/make/deb/x64/yomikiru_${makeResults[0].packageJSON.version}_amd64.deb`,
                    `./out/full/Yomikiru-v${makeResults[0].packageJSON.version}-amd64.deb`
                );
            downloadBtns += `[![Download 64-bit Linux (Debian)](https://img.shields.io/badge/Linux%2064--bit%20(Debian)-Yomikiru--v${makeResults[0].packageJSON.version}--amd64.deb-brightgreen?logo=debian&logoColor=red)](https://github.com/mienaiyami/yomikiru/releases/download/v${makeResults[0].packageJSON.version}/Yomikiru-v${makeResults[0].packageJSON.version}-amd64.deb)\n\n`;
            downloadBtns += "---\n\n";
            // }
            // });
            // });
            const base = fs.readFileSync("./changelog.md", "utf-8");
            fs.writeFileSync("./changelog-temp.md", downloadBtns + base, "utf-8");
        },
    },
};
