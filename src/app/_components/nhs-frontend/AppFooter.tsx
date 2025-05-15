import { Footer } from "nhsuk-react-components";

const AppFooter = () => {
  return (
    <>
      <Footer>
        <Footer.List>
          <Footer.ListItem
            href="https://www.nhs.uk/nhs-sites/"
            target={"_blank"}
          >
            NHS sites
          </Footer.ListItem>
          <Footer.ListItem
            href="https://www.nhs.uk/about-us/"
            target={"_blank"}
          >
            About us
          </Footer.ListItem>
          <Footer.ListItem
            href="https://www.nhs.uk/contact-us/"
            target={"_blank"}
          >
            Give us feedback
          </Footer.ListItem>
          <Footer.ListItem
            href="https://www.nhs.uk/about-us/sitemap/"
            target={"_blank"}
          >
            Sitemap
          </Footer.ListItem>
          <Footer.ListItem
            href="https://www.nhs.uk/our-policies/"
            target={"_blank"}
          >
            Our policies
          </Footer.ListItem>
        </Footer.List>
        <Footer.Copyright>© Crown copyright</Footer.Copyright>
      </Footer>
    </>
  );
};

export default AppFooter;
