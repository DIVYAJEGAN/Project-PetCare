import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, CircularProgress, Card, CardContent, CardMedia, Grid, Alert, Box, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';

const GlassCard = styled(Card)(({ theme }) => ({
  borderRadius: '16px',
  padding: theme.spacing(4),
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: theme.spacing(1.5),
  background: 'linear-gradient(45deg, #ff6f61, #ff3d6c)',
  color: '#fff',
  fontWeight: 'bold',
  '&:hover': {
    background: 'linear-gradient(45deg, #ff3d6c, #ff6f61)',
  },
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: '8px',
  backgroundColor: '#fff',
  '& .MuiInputBase-root': {
    borderRadius: '8px',
  },
  '& .MuiInputLabel-root': {
    color: '#333',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#ccc',
    },
    '&:hover fieldset': {
      borderColor: '#007bff',
    },
  },
}));

const CustomCardMedia = styled(CardMedia)(({ theme }) => ({
  borderRadius: '8px',
  height: 200,
  marginTop: theme.spacing(2),
}));

const Report = () => {
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [address, setAddress] = useState('');
  const [condition, setCondition] = useState('');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setPhoto(file);
    setPhotoURL(URL.createObjectURL(file));
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleConditionChange = (event) => {
    setCondition(event.target.value);
  };

  const handleContactChange = (event) => {
    setContact(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSeverityChange = (event) => {
    setSeverity(event.target.value);
  };

  const validateForm = () => {
    if (!photo) {
      setError('Please upload a photo of the injured dog.');
      return false;
    }
    if (!address) {
      setError('Please enter the address.');
      return false;
    }
    if (!condition) {
      setError('Please describe the dog\'s condition.');
      return false;
    }
    if (!contact) {
      setError('Please provide your contact information.');
      return false;
    }
    if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(contact) && !/^\d{10}$/.test(contact)) {
      setError('Please provide a valid email or 10-digit phone number.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('address', address);
    formData.append('condition', condition);
    formData.append('contact', contact);
    formData.append('description', description);
    formData.append('severity', severity);

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      const clinicResponse = await fetch(`/api/clinics?address=${address}`);
      if (!clinicResponse.ok) {
        throw new Error('Failed to fetch nearby clinics');
      }

      const clinicData = await clinicResponse.json();
      setClinics(clinicData);
      setSuccess('Report submitted successfully. Nearby clinics have been notified.');
    } catch (err) {
      if (err.message.includes('submit report')) {
        setError('Failed to submit the report. Please check your network connection and try again.');
      } else if (err.message.includes('fetch nearby clinics')) {
        setError('Failed to fetch nearby clinics. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 12 }}>
      <Box sx={{ backgroundColor: '#f4f4f9', padding: '24px', borderRadius: '16px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', minHeight: '80vh' }}>
        <GlassCard>
          <CardContent>
            <Typography variant="h4" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, marginBottom: '16px', color: '#000', textAlign: 'center' }}>
              Report an Injured Dog
            </Typography>
            <Typography variant="body1" style={{ fontFamily: 'Poppins, sans-serif', marginBottom: '16px', color: '#444', textAlign: 'center' }}>
              Help us provide immediate medical attention to street dogs. Fill out the form below and upload a photo to report an injured dog.
            </Typography>
            {error && <Alert severity="error" style={{ marginTop: '16px' }}>{error}</Alert>}
            {success && <Alert severity="success" style={{ marginTop: '16px' }}>{success}</Alert>}
            <form onSubmit={handleSubmit}>
              <Typography variant="h6" style={{ fontFamily: 'Poppins, sans-serif', marginBottom: '16px', color: '#444', textAlign: 'center' }}>
                Upload Photo of the Injured Dog
              </Typography>
              <CardMedia
                component="input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                sx={{ display: 'block', margin: '0 auto', mt: 2 }}
              />
              {photoURL && (
                <CustomCardMedia
                  component="img"
                  image={photoURL}
                  alt="Selected Photo"
                  style={{ borderRadius: '8px', height: '200px', margin: '0 auto', display: 'block' }}
                />
              )}
              <CustomTextField
                fullWidth
                label="Address of the Incident"
                variant="outlined"
                value={address}
                onChange={handleAddressChange}
                required
              />
              <CustomTextField
                fullWidth
                label="Condition of the Dog"
                variant="outlined"
                value={condition}
                onChange={handleConditionChange}
                required
              />
              <CustomTextField
                fullWidth
                label="Your Contact Information"
                variant="outlined"
                value={contact}
                onChange={handleContactChange}
                required
              />
              <CustomTextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={handleDescriptionChange}
                required
              />
              <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                <InputLabel>Severity of Injury</InputLabel>
                <Select
                  value={severity}
                  onChange={handleSeverityChange}
                  label="Severity of Injury"
                  required
                >
                  <MenuItem value="Minor">Minor</MenuItem>
                  <MenuItem value="Moderate">Moderate</MenuItem>
                  <MenuItem value="Severe">Severe</MenuItem>
                </Select>
              </FormControl>
              <GradientButton
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit'}
              </GradientButton>
            </form>
            {clinics.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6" style={{ fontFamily: 'Poppins, sans-serif', marginBottom: '16px', color: '#444', textAlign: 'center' }}>
                  Nearby Clinics
                </Typography>
                <Grid container spacing={2}>
                  {clinics.map((clinic, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)', textAlign: 'center', transition: 'transform 0.3s ease-in-out' }}>
                        <Typography variant="h6" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', marginBottom: '8px' }}>
                          {clinic.name}
                        </Typography>
                        <Typography variant="body2">{clinic.address}</Typography>
                        <Typography variant="body2">{clinic.phone}</Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </CardContent>
        </GlassCard>
      </Box>
    </Container>
  );
};

export default Report;
