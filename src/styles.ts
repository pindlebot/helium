import { makeStyles } from '@material-ui/styles'

export default makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: '0',
    right: '0',
    left: '0',
    top: '0'
  },
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  },
  chat: {
    position: 'absolute',
    right: '0',
    bottom: '0',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    margin: '20px',
    boxSizing: 'border-box',
    padding: '14px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    background: '#1563ff',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  card: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  paper: {
    minHeight: '250px',
    maxHeight: '704px',
    height: 'calc(100% - 300px)',
    width: '376px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  content: {
    overflowY: 'scroll'
  }
}))
