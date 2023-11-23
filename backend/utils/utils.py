class Utils:
    @staticmethod
    def convert_to_slug(name: str):
        return name.lower().replace(' ', '-')
