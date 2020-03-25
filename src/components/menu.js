import React, {useContext } from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import SettingsIcon from '@material-ui/icons/Settings';
import { Divider, Typography } from '@material-ui/core';
import { Store } from '../store/store';

const useStyles = makeStyles(theme => ({
    paper: {
    maxWidth: '800px',
    marginTop: theme.spacing(2),
    margin: '0 auto',
  },
  title:{
    textAlign: 'center',
    padding: theme.spacing(2),
    color: theme.palette.primary.dark
  }
}));

export function useRouter() {
  return useContext(RouterContext);
};

export default function Menu() {
  const classes = useStyles();
  const { state } = React.useContext(Store);

  const defaultMenu = 'tasks';
  const location = window.location.hash.split('/');
  const activeMenu = (location.length >= 2 ? location[1] : defaultMenu);
  const [tab, setTab] = React.useState(activeMenu);
  const { history } = useRouter();

  const handleChange = (event, newValue) => {
    setTab(newValue);
    history.push(`/${newValue}`);
  };

  return (
    <>
        <Paper square className={classes.paper}>
          <Typography className={classes.title} variant="h6">
            {state.general.title}
          </Typography>
          <Divider />
          <Tabs
            value={tab}
            onChange={handleChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            aria-label="icon tabs example"
          >
            <Tab
              value="tasks"
              icon={<DoneAllIcon />}
              aria-label="List" />
            <Tab
              value="setting"
              icon={<SettingsIcon />}
              aria-label="Settings" />
            </Tabs>
        </Paper>
    </>
  );
}


