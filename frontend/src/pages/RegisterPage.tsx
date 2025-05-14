import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Link,
  Alert,
} from '@mui/material';

import { authApi } from '../api';

interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>();
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      setError(null);
      await authApi.register({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      navigate('/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Register
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                autoComplete="username"
                autoFocus
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />
          
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
          
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="password"
                label="Password"
                type="password"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />
          
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            }}
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
          
          <Box textAlign="center">
            <Typography variant="body2">
              Already have an account?{' '}
              <Link component={RouterLink} to="/login">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;