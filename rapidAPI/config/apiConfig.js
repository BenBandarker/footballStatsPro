module.exports = {
    apiOne: {
        baseUrl: 'https://api-football-v1.p.rapidapi.com',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY_ONE,
          'X-RapidAPI-Host': process.env.RAPIDAPI_HOST_ONE,
      },
    },
    apiTwo: {
      baseUrl: 'https://api-two.example.com',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY_TWO,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST_TWO,
      },
    },
  };