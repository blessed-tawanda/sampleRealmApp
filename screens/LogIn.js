import React, {useState} from 'react';
import {Button, Text, Input} from 'react-native-elements';
import {useAuth} from '../AuthProvider';

export function LogIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState();

  const {logIn} = useAuth()

  return (
    <>
      <Text h3>Log In</Text>
      <Input
        autoCapitalize="none"
        placeholder="email"
        onChangeText={setEmail}
      />
      <Input
        secureTextEntry={true}
        placeholder="password"
        onChangeText={setPassword}
      />
      <Button
        onPress={async () => {
          console.log(
            `Log in button pressed with email ${email} and password ${password}`,
          );
          setError(null);
          try {
            await logIn(email, password);
          } catch (e) {
            setError(`Login failed: ${e.message}`);
          }
        }}
        title="Login"
      />
      <Text>{error}</Text>
    </>
  );
}