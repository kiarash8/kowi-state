import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { Button } from '@material-ui/core';
import { Store } from '../../store/store';
import { setTasks } from '../../store/actions';
import { Link as RouterLink } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';


const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: '800px',
      marginTop: theme.spacing(2),
      margin: '0 auto',
    },
    cardContent: {
      paddingBottom:'8px!important'
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function TaskList() {
    const classes = useStyles();
    const { state, dispatch } = React.useContext(Store);
    const handleToggle = id => () => {
      const tasks = state.tasks.items;
      const index = tasks.findIndex(x=> x.id === id);
      tasks[index].checked = !tasks[index].checked;

      setTasks({
        items: tasks,
      },
      dispatch);
    };
  
    return (
        <Box justifyContent="center">
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  {state.tasks.items.length > 0 ?
                    <List className={classes.list}>
                      {state.tasks.items.map(item => {
                          const labelId = `checkbox-list-label-${item.id}`;
                          return (
                          <ListItem key={item.id} dense button onClick={handleToggle(item.id)}>
                              <ListItemIcon>
                              <Checkbox
                                  edge="start"
                                  checked={item.checked}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ 'aria-labelledby': labelId }}
                              />
                              </ListItemIcon>
                              <ListItemText id={labelId} primary={item.title} />
                              <ListItemSecondaryAction>
                              <ItemMenu id={item.id} />
                              </ListItemSecondaryAction>
                          </ListItem>
                          );
                      })}
                    </List>                  
                  : null}
                  <Button
                    component={RouterLink} to={'tasks/new'}
                    fullWidth
                    variant="contained"
                    color="primary">
                    Add new task
                  </Button>
                </CardContent>
            </Card>
        </Box>      
    );
}

function ItemMenu(props) {
  const { state, dispatch } = React.useContext(Store);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const id = props.id;

  function openMenu(event) { setAnchorEl(event.currentTarget); }
  function closeMenu() { setAnchorEl(null); }
  function openDeleteDialog(){
      closeMenu();
      setDeleteDialog(true);
  }

  function remove() {
      const tasks = state.tasks.items;
      const index = tasks.findIndex(x=> x.id === id);
      tasks.splice(index, 1);
      setTasks({
        items: tasks,
      },
      dispatch);
  }
  return (
      <>
      <IconButton
          size="small"
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={openMenu}
      >
          <MoreVertIcon />
      </IconButton>
      <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={closeMenu}
          PaperProps={{
          style: {
              maxHeight: 48 * 4.5,
              width: 'auto',
          },
          }}
      >
          <MenuItem component={RouterLink} to={`./tasks/detail/${id}`} >
              <ListItemIcon style={{minWidth:'32px'}}>
                  <EditIcon />
              </ListItemIcon>
              <ListItemText primary="Edit" />
          </MenuItem>
          <MenuItem onClick={openDeleteDialog}>
              <ListItemIcon style={{minWidth:'32px'}}>
                  <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Delete" />
          </MenuItem>
      </Menu>
      <Dialog
          maxWidth="xs"
          open={deleteDialog}
          onClose={() =>  setDeleteDialog(false)}
          aria-labelledby="max-width-dialog-title"
      >
          <DialogTitle id="max-width-dialog-title">Are you sure?</DialogTitle>
          <DialogContent>
          <DialogContentText>You won't able to revert this!</DialogContentText>
          </DialogContent>
          <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} color="secondary">
              Cancle
          </Button>
          <Button
          onClick={() => remove()}
          color="primary">
              Yes
          </Button>
          </DialogActions>
      </Dialog>
      </>
  );
}