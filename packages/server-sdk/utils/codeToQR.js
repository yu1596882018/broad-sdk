/**
 * 批量将代码文件内容转为二维码图片
 * 支持递归遍历目录，分段生成二维码，支持多种代码文件类型
 *
 * 用法：node codeToQR.js
 *
 * @author yu1596882018
 */
const QRcode = require('qrcode')
const fs = require('fs')
const path = require('path')
let errorCount = 0

// 需要读取的目录
const SRC_DIR = path.resolve('./src')
// 二维码输出目录
const OUTPUT_DIR = path.resolve('./output2')

main()

function main() {
  traverseDir(SRC_DIR, OUTPUT_DIR)
}

/**
 * 遍历目录，递归处理文件和子目录
 * @param {string} dirPath - 源目录
 * @param {string} outputDir - 输出目录
 */
function traverseDir(dirPath, outputDir) {
  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error('[codeToQR] 读取目录失败:', dirPath, err)
      return
    }
    files.forEach(filename => {
      const filePath = path.join(dirPath, filename)
      const outPath = path.join(outputDir, filename)
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('[codeToQR] 获取文件信息失败:', filePath, err)
          return
        }
        if (stats.isFile() && /(.html|.ts|.js|.scss|.json|.less|.css)$/i.test(filePath)) {
          // 处理代码文件
          fs.mkdir(outPath, { recursive: true }, mkdirErr => {
            if (mkdirErr) console.error('[codeToQR] 创建输出目录失败:', outPath, mkdirErr)
            try {
              const data = fs.readFileSync(filePath)
              const text = data.toString()
              const contentLen = 2000 // 每个二维码最大内容长度
              const steps = Math.ceil(text.length / contentLen)
              for (let i = 0; i < steps; i++) {
                generateQR(
                  path.join(outPath, `${i}.jpg`),
                  text.slice(i * contentLen, (i + 1) * contentLen),
                  (err) => {
                    if (err) {
                      // 分两段再尝试
                      generateQR(
                        path.join(outPath, `${i}-0.jpg`),
                        text.slice(i * contentLen, (i + 0.5) * contentLen),
                        (err) => {
                          if (err) {
                            console.error('[codeToQR] 二维码生成失败:', path.join(outPath, `${i}-0.jpg`), err, ++errorCount)
                          }
                        }
                      )
                      generateQR(
                        path.join(outPath, `${i}-1.jpg`),
                        text.slice((i + 0.5) * contentLen, (i + 1) * contentLen),
                        (err) => {
                          if (err) {
                            console.error('[codeToQR] 二维码生成失败:', path.join(outPath, `${i}-1.jpg`), err, ++errorCount)
                          }
                        }
                      )
                    }
                  }
                )
              }
            } catch (e) {
              console.error('[codeToQR] 读取文件失败:', filePath, e)
            }
          })
        } else if (stats.isDirectory()) {
          // 递归处理子目录
          traverseDir(filePath, outPath)
        }
      })
    })
  })
}

/**
 * 生成二维码图片
 * @param {string} filePath - 输出图片路径
 * @param {string} text - 二维码内容
 * @param {Function} cb - 回调
 */
function generateQR(filePath, text, cb) {
  QRcode.toFile(filePath, text, cb)
}
