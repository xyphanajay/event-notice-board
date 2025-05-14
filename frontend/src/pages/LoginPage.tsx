import React, { useState } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
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

import { useAuth } from '../context/AuthContext';
import { authApi } from '../api';

interface LoginFormInputs {
  email: string;
  password: string;
}

interface LocationState {
  from?: {
    pathname: string;
  };
}

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  
  const from = (location.state as LocationState)?.from?.pathname || '/';
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>();
  
  const onSubmit = async (data: LoginFormInputs) => {
    try {
      setError(null);
      const response = await authApi.login(data);
      login(response.data.token, response.data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Login
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                autoFocus
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
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
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
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
          
          <Box textAlign="center">
            <Typography variant="body2">
              Don't have an account?{' '}
              <Link component={RouterLink} to="/register">
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;