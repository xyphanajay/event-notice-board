import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { format } from 'date-fns';

import { eventsApi } from '../api';

interface LocationCoords {
  lat: number;
  lng: number;
}

const EventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [radius, setRadius] = useState<number>(10); // 10 km default radius
  const [category, setCategory] = useState<string>('all');
  const [location, setLocation] = useState<LocationCoords | null>(null);
  
  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  
  // Fetch events
  const {
    data: events,
    isLoading,
    isError,
    error,
  } = useQuery(
    ['events', location, radius],
    () => eventsApi.getEvents({ 
      ...(location && { lat: location.lat, lng: location.lng, radius }),
    }),
    {
      enabled: true, // We can fetch even without location, in which case backend will return all events
      select: (response) => response.data,
    }
  );
  
  // Handlers
  const handleRadiusChange = (_event: Event, value: number | number[]) => {
    setRadius(value as number);
  };
  
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value);
  };
  
  // Filter events based on search term and category
  const filteredEvents = events?.filter((event) => {
    const matchesSearchTerm = searchTerm
      ? event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesCategory = category === 'all' ? true : event.category === category;
    
    return matchesSearchTerm && matchesCategory;
  });
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Discover Events Near You
      </Typography>
      
      {/* Search and Filter Controls */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="social">Social</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="education">Education</MenuItem>
                <MenuItem value="arts">Arts & Culture</MenuItem>
                <MenuItem value="technology">Technology</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="contained"
              fullWidth
              onClick={getUserLocation}
              startIcon={<LocationOnIcon />}
            >
              {location ? 'Update My Location' : 'Use My Location'}
            </Button>
          </Grid>
          
          {location && (
            <Grid item xs={12}>
              <Typography gutterBottom>Distance: {radius} km</Typography>
              <Slider
                value={radius}
                onChange={handleRadiusChange}
                aria-labelledby="distance-slider"
                valueLabelDisplay="auto"
                min={1}
                max={50}
              />
            </Grid>
          )}
        </Grid>
      </Box>
      
      {/* Events List */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Alert severity="error">
          Error loading events: {(error as any).message}
        </Alert>
      ) : filteredEvents?.length === 0 ? (
        <Alert severity="info">
          No events found. Try adjusting your search criteria or create your own event!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredEvents?.map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="div"
                  sx={{ pt: '56.25%', bgcolor: 'primary.light' }} // 16:9 aspect ratio
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {event.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(`${event.date}T${event.time}`), 'PPP p')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {event.locationName}
                    </Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    {event.description.length > 100
                      ? `${event.description.substring(0, 100)}...`
                      : event.description}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/events/${event.id}`}
                    variant="outlined"
                    size="small"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default EventsPage;