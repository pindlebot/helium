import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  chevron: {
    color: '#fff',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  actions: {
    width: 30,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  delete: {
    display: 'none'
  },
  content: {
    padding: 0,
    overflowY: 'scroll',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    '&:last-child': {
      paddingBottom: 0
    }
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexBasis: '25%',
    width: '100%',
    borderTop: '1px solid #ddd',
    padding: '14px',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px'
  },
  toolbar: {
    flexBasis: '30%',
    display: 'flex',
    justifyContent: 'flex-end'
  }
}))

export default useStyles