/**
 * This file is not used, but serves as a template for a possible future
 * class based structure
 */
class WatchableFile {
  constructor(fullPath, config, notifications, callbacks) {
    this.fileInfo = {
      basename: path.basename(fullPath),
      fullPath: fullPath,
      dirname: path.dirname(fullPath),
      stat: fs.statSync(fullPath),
    }
    this.config = config
    this.notifications = notifications
    this.callbacks = callbacks
    this.tail = null
  }

  get details() {
    return {
      ...this.fileInfo,
      ...this.config,
    }
  }

  watch() {
    if (this.tail) {
      this.tail.watch()
    } else {
      this.tail = new Tail(this.details.fullPath)

      this.tail.on(
        'line',
        callbacks.onSuccess(this.details, this.notifications),
      )
      this.tail.on('error', callbacks.onError)
    }
  }

  unwatch() {
    if (this.tail) {
      this.tail.unwatch()
    }
  }
}
