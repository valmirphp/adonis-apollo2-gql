'use strict'

const { ServiceProvider } = use('@adonisjs/fold')

class GQLProvider extends ServiceProvider {

  register () {
    console.log('GOGOOGOG')
    // this.app.singleton('Adonis/Addons/Queue', () => {
    //     const Config = this.app.use('Adonis/Src/Config')
    //     return new (require('../src/Queue'))(Config)
    // })
  }
}

module.exports = GQLProvider
