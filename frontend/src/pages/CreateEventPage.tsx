import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  Snackbar,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';

import { eventsApi } from '../api';
import { useAuth } from '../context/AuthContext';

interface EventFormInputs {
  title: string;
  description: string;
  date: Date | null;
  time: Date | null;
  locationName: string;
  capacity: string;
  category: string;
}

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EventFormInputs>({
    defaultValues: {
      title: '',
      description: '',
      date: null,
      time: null,
      locationName: '',
      capacity: '',
      category: '',
    },
  });
  
  // Mutation for creating an event
  const createEventMutation = useMutation(
    (data: any) => eventsApi.createEvent(data),
    {
      onSuccess: () => {
        setSuccess(true);
        // Navigate to events page after a delay
        setTimeout(() => {
          navigate('/events');
        }, 2000);
      },
    }
  );
  
  const onSubmit = async (data: EventFormInputs) => {
    // Format date and time
    const formattedDate = data.date ? data.date.toISOString().split('T')[0] : null;
    const formattedTime = data.time
      ? `${data.time.getHours().toString().padStart(2, '0')}:${data.time
          .getMinutes()
          .toString()
          .padStart(2, '0')}:00`
      : null;
    
    // TODO: In a real implementation, we would get the actual coordinates
    // for the location using the geocoding service
    const mockLocation = {
      type: 'Point',
      coordinates: [-122.4194, 37.7749], // Example: San Francisco
    };
    
    // Prepare data for API
    const eventData = {
      title: data.title,
      description: data.description,
      date: formattedDate,
      time: formattedTime,
      locationName: data.locationName,
      location: mockLocation,
      capacity: data.capacity ? parseInt(data.capacity, 10) : null,
      category: data.category || null,
      hostId: user?.id,
    };
    
    createEventMutation.mutate(eventData);
  };
  
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Event
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="title"
                control={control}
                rules={{
                  required: 'Title is required',
                  minLength: {
                    value: 3,
                    message: 'Title must be at least 3 characters',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Event Title"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: 'Description is required',
                  minLength: {
                    value: 10,
                    message: 'Description must be at least 10 characters',
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="date"
                  control={control}
                  rules={{
                    required: 'Date is required',
                    validate: value => {
                      if (!value) return 'Date is required';
                      return value > new Date() || 'Date must be in the future';
                    },
                  }}
                  render={({ field }) => (
                    <DatePicker
                      label="Event Date"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                          helperText: errors.date?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Controller
                  name="time"
                  control={control}
                  rules={{ required: 'Time is required' }}
                  render={({ field }) => (
                    <TimePicker
                      label="Event Time"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.time,
                          helperText: errors.time?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="locationName"
                control={control}
                rules={{ required: 'Location is required' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Location"
                    fullWidth
                    error={!!errors.locationName}
                    helperText={errors.locationName?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="capacity"
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9]*$/,
                    message: 'Capacity must be a number',
                  },
                  validate: value => {
                    if (value && parseInt(value, 10) < 1) {
                      return 'Capacity must be at least 1';
                    }
                    return true;
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Capacity (Optional)"
                    fullWidth
                    type="number"
                    error={!!errors.capacity}
                    helperText={errors.capacity?.message || 'Leave blank for unlimited'}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.category}>
                    <InputLabel id="category-select-label">Category (Optional)</InputLabel>
                    <Select
                      {...field}
                      labelId="category-select-label"
                      label="Category (Optional)"
                    >
                      <MenuItem value=""><em>None</em></MenuItem>
                      <MenuItem value="social">Social</MenuItem>
                      <MenuItem value="sports">Sports</MenuItem>
                      <MenuItem value="education">Education</MenuItem>
                      <MenuItem value="arts">Arts & Culture</MenuItem>
                      <MenuItem value="technology">Technology</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                    {errors.category && (
                      <FormHelperText>{errors.category.message}</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting || createEventMutation.isLoading}
                sx={{ mr: 1 }}
              >
                {createEventMutation.isLoading ? 'Creating...' : 'Create Event'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Success Message */}
      <Snackbar
        open={success}
        autoHideDuration={5000}
        onClose={() => setSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Event created successfully! Redirecting to events page...
        </Alert>
      </Snackbar>
      
      {/* Error Message */}
      {createEventMutation.isError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error creating event: {(createEventMutation.error as any)?.message || 'Please try again.'}
        </Alert>
      )}
    </Container>
  );
};

export default CreateEventPage;