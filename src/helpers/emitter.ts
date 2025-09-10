import mitt from 'mitt'

type Events = {
  'dummy-event': any
}

export default mitt<Events>()
