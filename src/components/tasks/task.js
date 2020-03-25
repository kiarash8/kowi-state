import React, {useContext, useCallback } from 'react';
import { __RouterContext as RouterContext } from 'react-router';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { Link as RouterLink } from 'react-router-dom';
import { Store } from '../../store/store';
import { setTasks } from '../../store/actions';
import { Switch } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: '800px',
        marginTop: theme.spacing(2),
        margin: '0 auto',
      },
      cardContent: {
        paddingBottom:'8px!important'
      },
      header: {
        width: '100%',
        color: theme.palette.primary.dark,
        '& .MuiCardHeader-title':{
            fontSize: '1rem'
        },
        '& .MuiCardHeader-action':{
            marginRight: theme.spacing(4),
            marginTop: '0px',
        }
    },
}));

export function useRouter() {
    return useContext(RouterContext);
};

export default function Task(props) {
    const classes = useStyles();
    const params = props.match.params;
    const id = params ? params.id : null;
    const { history } = useRouter();
    const { state, dispatch } = React.useContext(Store);
    const [fields, setFields] = React.useState({
        title:{
            value:'',
            validation: [],
            required: true,
            isInLength: true,
            minLength: 3,
            maxLength: 50
        },
        description:{
            value:'',
            validation: [],
            required: true
        },
    });
    const [checked, setChecked] = React.useState(false);
    const handleChecked = event => {
        setChecked(event.target.checked);
    };
    
    const handleFieldChange = name => event => {
        setFields({
            ...fields,
            [name]: {
                ...fields[name],
                value: event.target.value,
                validation: [],
            }
        });
    };
    const fieldsValidation = () => {
        const isValid = [];
        const checkedField = [];
        Object.keys(fields).forEach(el => {
            const validationErr = [];
            //required
            if(fields[el].required && fields[el].value === '') {validationErr.push('required')}
            //check Email
            const emailPattern = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if(fields[el].isEmail) { 
                if(!emailPattern.test(fields[el].value.toString().trim())) { validationErr.push('email')}
            }
            //check Length
            if(fields[el].isInLength) { 
                if(fields[el].value.length < fields[el].minLength) { validationErr.push('minLength') }
                else if(fields[el].value.length > fields[el].maxLength) { validationErr.push('maxLength') }
            }
            //check Match
            if(fields[el].isMatch) { 
                if(fields[el].value !== fields[fields[el].matchField].value){ validationErr.push('notMatch') }
            }
          
            isValid.push(validationErr.length > 0 ? false : true);
            const val = {
                ...fields[el],
                value: fields[el].value, 
                validation: validationErr,
            };
            Object.assign(checkedField, {[el]: val});
        });
        return({
            status: isValid.includes(false) ? false : true,
            fields: checkedField
        });
    }
    const validationError = (name, field) => {
        switch (field.validation[0]) {
            case 'required':
                return `Enter ${name}`;
            case 'email':
                return 'Email is not valid';
            case 'minLength':
                return `${name} must be at least ${field.minLength} characters`;
            case 'maxLength':
                return `${name} must be less than ${field.maxLength} characters`;
            case 'notMatch':
                return `${name} do not match with ${field.matchField}`;
            default:
                return '';
        }
    }


    const getData = useCallback(() => {
        const tasks = state.tasks.items;
        const index = tasks.findIndex(x=> x.id === id);
        if(index > -1){
            const item = tasks[index];
            setFields({
                ...fields,
                title: {
                    ...fields.title,
                    value: item.title,
                    validation: [],
                },
                description: {
                    ...fields.description,
                    value: item.description,
                    validation: [],
                }
            });
            setChecked(item.checked);
        }
        else{
            history.push('/tasks');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])

    React.useEffect(() => {
        if(id){
          getData();
        }
    }, [getData, id]);

    function save(){ 
        const validation = fieldsValidation();
        if (validation.status){ id ? edit() : add(); }
        else { setFields(validation.fields); }
    }
    function add(){
        const tasks = state.tasks.items;
        tasks.push({
          id: uuidv4(),
          title: fields.title.value,
          description: fields.description.value,
          checked: false
        })
  
        setTasks({
          items: tasks,
        },
        dispatch);
        history.push('/tasks');

    }
    function edit(){
        const tasks = state.tasks.items;
        const index = tasks.findIndex(x=> x.id === id);
        tasks[index].title = fields.title.value;
        tasks[index].description = fields.description.value;
        tasks[index].checked = checked;
        setTasks({
          items: tasks,
        },
        dispatch);
        history.push('/tasks'); 
    }
    const uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
            return v.toString(16);
        });
    }

    return (
        <Box justifyContent="center">
            <Card className={classes.card}>
                <CardHeader
                    className={classes.header}
                    title={id ? 'Edit task' :  'Create new task'}
                    action={
                        id ?
                        <Switch
                            checked={checked}
                            onChange={handleChecked}
                        />
                        : null
                    }
                />
                <CardContent className={classes.cardContent}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                value={fields.title.value}
                                onChange={handleFieldChange('title')}
                                error={fields.title.validation.length > 0}
                                helperText={fields.title.validation.length > 0 ? validationError('title', fields.title) : ' '}
                                label="Title"
                                variant="outlined"
                                type="text"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={fields.description.value}
                                onChange={handleFieldChange('description')}
                                error={fields.description.validation.length > 0}
                                helperText={fields.description.validation.length > 0 ? validationError('description', fields.description) : ' '}
                                label="Description"
                                multiline
                                rows="4"
                                variant="outlined"
                                fullWidth
                                />
                        </Grid>
                    </Grid>
                </CardContent>
                <CardActions>
                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        justify="flex-end"
                        alignItems="flex-start">
                            <Grid item>
                                <Button component={RouterLink} to={'/taks'} className={classes.button}>
                                    back
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={() => save()}
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}>
                                    {id ? 'edit' : 'add'}
                                </Button>          
                            </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Box>   
    );
}