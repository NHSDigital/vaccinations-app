import configProvider from "@src/lib/config";

const config = configProvider();

const getContent = async () => {
  const response: Response = await fetch(
    `${config.CONTENT_API_ENDPOINT}${config.CONTENT_API_VACCINATIONS_PATH}`,
  );
  return response.json();
};

export default getContent;
