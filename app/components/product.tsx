import "@aws-amplify/ui-react/styles.css";
import {
  WithAuthenticatorProps,
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";

import { Amplify } from 'aws-amplify';
import config from '../../src/aws-exports';
Amplify.configure(config);


function App({ signOut } :  WithAuthenticatorProps ) {
  return (
    <View className="App">
      <Card>
        <Heading level={1}>We now have Auth!</Heading>
      </Card>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);