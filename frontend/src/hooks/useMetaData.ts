interface Props {
  title?: string;
  iconUrl?: string;
}

export const useMetaData = ({ title, iconUrl }: Props) => {
  if (title) {
    document.title = title;
  }

  const link = document.querySelector('link[rel="icon"]');
  if (link && iconUrl) {
    link.setAttribute('href', iconUrl);
  }
};
