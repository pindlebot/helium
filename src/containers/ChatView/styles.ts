import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  chevron: {
    color: '#fff',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  title: {
    textAlign: 'center',
    marginBottom: 20
  },
  comment: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 6
  },
  actions: {
    width: 30,
    display: 'flex',
    justifyContent: 'flex-end'
  },
  delete: {
    display: 'none'
  },
  // content: {
  //   padding: 20,
  //   backgroundColor: '#fff',
  //   width: '100%',
  //   flexBasis: '65%',
  //   boxSizing: 'border-box',
  //   overflowY: 'scroll'
  // },
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
  body: {
    backgroundColor: '#fafafa',
    borderRadius: 2,
    padding: '5px 8px',
    textAlign: 'right'
  },
  self: {
    justifyContent: 'flex-end',
    '&$body': {
      backgroundColor: '#286efa',
      color: '#fff'
    },
    '&:hover $delete': {
      display: 'block',
      cursor: 'pointer'
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
  },
  input: {
    borderWidth: '0',
    padding: '4px',
    width: '70%',
    boxSizing: 'border-box',
    '&:focus': {
      outline: 'none'
    }
  }
}))

export default useStyles