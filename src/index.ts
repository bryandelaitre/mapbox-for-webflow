import { greetUser } from '$utils/greet';

window.Webflow ||= [];
window.Webflow.push(() => {
  const name = 'Bryan DELAITRE';
  greetUser(name);
  console.log('test');
});
