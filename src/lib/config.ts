const configProvider = () => ({
  CONTENT_API_ENDPOINT: process.env.CONTENT_API_ENDPOINT,
  CONTENT_API_VACCINATIONS_PATH: process.env.CONTENT_API_VACCINATIONS_PATH,
});

export default configProvider;
