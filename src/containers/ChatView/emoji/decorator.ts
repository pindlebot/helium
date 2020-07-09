import decorateComponentWithProps from 'decorate-component-with-props'
import { CompositeDecorator } from 'draft-js'

import emojiStrategy from './emojiStrategy'
import Emoji from './components/Emoji'

const imagePath = '//cdn.jsdelivr.net/emojione/assets/svg/'
const imageType = 'svg'
const cacheBustParam = '?v=2.2.7'
const useNativeArt = false

const compositeDecorator = new CompositeDecorator([
  {
    strategy: emojiStrategy,
    component: decorateComponentWithProps(Emoji, { imagePath, imageType, cacheBustParam, useNativeArt }),
  }
])

export default compositeDecorator
