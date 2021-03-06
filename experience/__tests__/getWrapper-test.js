import getWrapper from '../getWrapper'

const registrar = '47147'
const registrar2 = '74174'
const componentId = 'foo'
const noop = () => {}

describe('getWrapper', () => {
  let wrapper
  beforeEach(() => {
    wrapper = getWrapper(registrar, componentId)
  })
  afterEach(() => {
    wrapper = undefined
    window.__qubit = undefined
  })

  describe('isClaimed', () => {
    it('returns unclaimed correctly', () => {
      expect(wrapper.isClaimed()).toEqual(false)
    })
    it('returns claimed correctly', () => {
      window.__qubit.react.components[componentId].owner = 'MEEE'
      expect(wrapper.isClaimed()).toEqual(true)
    })
  })

  describe('claim', () => {
    it('claims the wrapper if it is free', () => {
      wrapper.claim()
      expect(window.__qubit.react.components[componentId].owner).not.toBeUndefined()
    })
    it('does not claim when the wrapper is already claimed', () => {
      getWrapper(registrar2, componentId).claim()
      const claimee = window.__qubit.react.components[componentId].owner
      wrapper.claim()
      expect(window.__qubit.react.components[componentId].owner).toBe(claimee)
    })
  })

  describe('release', () => {
    describe('if not claimed by the instance', () => {
      beforeEach(() => {
        getWrapper(registrar2, componentId).claim()
      })
      it('does not release the wrapper', () => {
        wrapper.release()
        expect(window.__qubit.react.components[componentId].owner).not.toEqual(false)
      })
      it('does not remove the renderFunction', () => {
        window.__qubit.react.components[componentId].renderFunction = noop
        wrapper.release()
        expect(window.__qubit.react.components[componentId].renderFunction).not.toBeUndefined()
      })
      it('does not call the update funtions', () => {
        const forceUpdate = jest.fn()
        window.__qubit.react.components[componentId].instances = [{forceUpdate}]
        wrapper.release()
        expect(forceUpdate).not.toHaveBeenCalled()
      })
    })
    describe('if claimed by the instance', () => {
      beforeEach(() => {
        wrapper.claim()
      })
      it('releases the wrapper', () => {
        wrapper.release()
        expect(window.__qubit.react.components[componentId].owner).toBeUndefined()
      })
      it('removes the renderFunction', () => {
        window.__qubit.react.components[componentId].renderFunction = noop
        wrapper.release()
        expect(window.__qubit.react.components[componentId].renderFunction).toBeUndefined()
      })
      it('calls the update functions', () => {
        const forceUpdate = jest.fn()
        window.__qubit.react.components[componentId].instances = [{forceUpdate}]
        wrapper.release()
        expect(forceUpdate).toHaveBeenCalled()
      })
    })
  })

  describe('render', () => {
    describe('if not claimed by the instance', () => {
      it('does not set the render function', () => {
        wrapper.render(noop)
        expect(window.__qubit.react.components[componentId].renderFunction).not.toBe(noop)
      })
      it('does not call update', () => {
        const forceUpdate = jest.fn()
        window.__qubit.react.components[componentId].instances = [{forceUpdate}]
        wrapper.render(noop)
        expect(forceUpdate).not.toHaveBeenCalled()
      })
      it('returns false', () => {
        expect(wrapper.render(noop)).toEqual(false)
      })
    })
    describe('if claimed by the instance', () => {
      beforeEach(() => {
        wrapper.claim()
      })
      it('sets the render function', () => {
        wrapper.render(noop)
        expect(window.__qubit.react.components[componentId].renderFunction).toBe(noop)
      })
      it('calls update', () => {
        const forceUpdate = jest.fn()
        window.__qubit.react.components[componentId].instances = [{forceUpdate}]
        wrapper.render(noop)
        expect(forceUpdate).toHaveBeenCalled()
      })
      it('returns true', () => {
        expect(wrapper.render(noop)).toEqual(true)
      })
    })
  })
})
