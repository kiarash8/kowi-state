import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { TextField, CardActions, Button } from '@material-ui/core';
import { Store } from '../../store/store';
import { setGeneral, resetGeneral } from '../../store/actions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
    card: {
      maxWidth: '800px',
      marginTop: theme.spacing(2),
      margin: '0 auto',
    },
    cardContent: {
      paddingBottom:'8px!important'
    },
}));

export default function Setting() {
    const classes = useStyles();
    const { state, dispatch } = React.useContext(Store);
    const [fields, setFields] = React.useState({
        title:{
            type:'textfield',
            value:'',
            validation: [],
            required: true,
            isInLength: true,
            minLength: 3,
            maxLength: 20
        },
        notification:{
            type:'checkbox',
            value: false,
            validation: [],
        },
    });


    React.useEffect(() => {
        setData(state.general);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setData = (model) => {
        setFields({
            ...fields,
            title: {
                ...fields.title,
                value: model.title,
                validation: [],
            },
            notification: {
                ...fields.notification,
                value: model.notification,
                validation: [],
            },
        });
    }

    const handleFieldChange = name => event => {
        let value;
        switch (fields[name].type) {
            case 'textfield':
                value = event.target.value;
                break;
            case 'checkbox':
                value = event.target.checked;
                break;
            default:
                value = '';
                break;
        }
        setFields({
            ...fields,
            [name]: {
                ...fields[name],
                value: value,
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
    const save = () => {
        const validation = fieldsValidation();
        if (validation.status){
            setGeneral({
                title: fields.title.value,
                notification: fields.notification.value
            },
            dispatch);
        }
        else { setFields(validation.fields); }
    }
    const isChange = () => {
        const changes = [];
        const general = state.general;
        changes.push(fields.title.value === general.title ? false : true);
        changes.push(fields.notification.value === general.notification ? false : true);
        return changes.includes(true) ? false : true;
    }

    const reset = () => {
        const resetGeneralModel = resetGeneral(dispatch);
        setData(resetGeneralModel);            
    }
  
    return (
        <Box justifyContent="center">
            <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                    <Grid container spacing={1}>
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
                            <FormControlLabel
                                control={
                                <Checkbox
                                    checked={fields.notification.value}
                                    onChange={handleFieldChange('notification')}
                                    color="primary"
                                />
                                }
                                label="Get notification"
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
                                <Button
                                    onClick={() => reset()}
                                    variant="outlined"
                                    color="secondary"
                                    className={classes.button}>
                                    reset to default
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={() => save()}
                                    disabled={isChange()}
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}>
                                    save
                                </Button>          
                            </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Box>      
    );
}