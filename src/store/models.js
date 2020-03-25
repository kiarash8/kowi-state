//create your model with below structure
// {
//   name:'your-model-name', // do not use uppercase for model name
//   storage: true, // if is 'true' model saved automatically on localstorage
//   model: {
//     // ...your model object
//   }
// }

export const models = [
    {
      name:'tasks',
      storage: false,
      model: {
        items: [],
      }
    },
    {
      name:'general',
      storage: true,
      model: {
        title: 'Kowi State - Taskboard (example)',
        notification: false,
      }
    },
];