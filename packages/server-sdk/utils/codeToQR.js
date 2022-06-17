// 代码批量转二维码脚本
const QRcode = require("qrcode");
const fs = require('fs');
const path = require('path');
let errorNum = 0;

// 文件夹路径
let filePath = path.resolve('./src'); // 需要读取的目录
let outputPath = path.resolve('./output2'); // 二维码保存目录

fileDisplay(filePath, outputPath);

// 遍历文件夹
function fileDisplay(filePath, outputPath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function(err, files) {
    if (err) {
      console.error(err, "读取文件失败")
    } else {
      //遍历读取到的文件列表
      files.forEach(function(filename) {
        //获取当前文件的绝对路径
        let fileDir = path.join(filePath, filename);
        let outputDir = path.join(outputPath, filename);
        //根据文件路径获取文件信息
        fs.stat(fileDir, function(err, stats) {
          if (err) {
            console.error('获取文件信息失败');
          } else {
            let isFile = stats.isFile();
            let isDir = stats.isDirectory();
            if (isFile && /(.html|.ts|.js|.scss|.json|.less|.css)$/i.test(fileDir)) {
              // 是文件，打印文件路径
              // outputDir = outputDir.replace(/\./g, '-')
              // console.log(fileDir, outputDir)

              fs.mkdir(outputDir,{recursive: true}, function (err) {
                if(err) console.log('mkdir', outputDir, err);

                try {
                  var data = fs.readFileSync(fileDir);

                  const text = data.toString()
                  const textLength = text.length
                  const contentNum = 2000
                  const step = Math.ceil(textLength / contentNum)

                  for (let i = 0; i < step; i++) {
                    QRcode.toFile(
                      path.join(outputDir, "./"+i+".jpg"),
                      text.slice(i * contentNum, (i + 1) * contentNum),
                      (err) => {
                        if (err)  {
                          QRcode.toFile(
                            path.join(outputDir, "./"+i+"-0.jpg"),
                            text.slice(i * contentNum, (i + 0.5) * contentNum),
                            (err) => {
                              if (err)  {
                                console.log('toFile', path.join(outputDir, "./"+i+"-0.jpg"), err, ++errorNum)
                              }
                            }
                          );

                          QRcode.toFile(
                            path.join(outputDir, "./"+i+"-1.jpg"),
                            text.slice((i + 0.5) * contentNum, (i + 1) * contentNum),
                            (err) => {
                              if (err)  {
                                console.log('toFile', path.join(outputDir, "./"+i+"-1.jpg"), err, ++errorNum)
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                } catch (e) {
                   console.log('readFileSync', fileDir, e);
                }
              })
            }
            if (isDir) {
              //是文件夹，继续递归
              fileDisplay(fileDir, outputDir);
            }
          }
        })
      });
    }
  });
}
