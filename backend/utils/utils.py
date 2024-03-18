class Utils:
    @staticmethod
    def convert_to_slug(name: str):
        """Convert a string to a slug.
        
        :param name: The string to be converted
        :type name: str
        
        :return: The converted string
        :rtype: str
        
        """
        return name.lower().replace(' ', '-')
