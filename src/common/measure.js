const measure = {
  // 空间长度测量
  measureLength: (opts) => {
    if (opts.callback) opts.callback()
  },
  // 空间面积测量
  measureArea: (opts) => {
    if (opts.callback) opts.callback()
  },
  // 三角测量
  measureTriangle: (opts) => {
    if (opts.callback) opts.callback()
  },
  // 清除测量结果
  clearMeasureResult: (opts) => {
    if (opts.callback) opts.callback()
  }
}

export default measure
