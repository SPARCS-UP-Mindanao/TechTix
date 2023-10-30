# Front-End Guide

## Setting up your local environment

- Ensure that you have `node v18+`, and `npm`.
- Clone the repository in your machine. You can view detailed instructions [here](https://docs.google.com/spreadsheets/d/1fs1PiRtqxIcetbEjcDo6Adia3vk7rxpiOeCc2Egtb3s/edit#gid=2016470823).
- Open the repository in your IDE
- Open up your IDE's terminal. Make sure you're at the root folder of the project. Enter `cd frontend` in the terminal
![image](https://github.com/SPARCS-UP-Mindanao/SPARCS-Event-Platform/assets/85269524/adcdd520-d032-4380-8a85-81bbf39805c2)
- After that, you can install the dependencies by running the `npm install` command.
- After installing, you can now run the project by entering `npm run dev` and click on the url provided.

![image](https://github.com/SPARCS-UP-Mindanao/SPARCS-Event-Platform/assets/85269524/c44ea864-f1da-4d78-bb0c-980345125b3f)

## Directory guide

We will mostly work in the `frontend/src` folder.

![image](https://github.com/SPARCS-UP-Mindanao/SPARCS-Event-Platform/assets/85269524/f6cb7718-3817-4c12-9574-ff5c7a09f033)


We have these folders, and here's what they're for:
- `api` - contains all of the API calls that we will throughout the project
-  `assets` - contains all other files like pictures, fonts, gifs, etc.
-  `components` - contains all of the **reusable** components throughout the project.
-  `context` - contains all of the contexts that the project uses.
-  `hooks` - contains all the custom hooks.
-  `model` - contains the interface/types of the APIs that we use.
-  `pages` - contains all of the pages and their respective components.
-  `routes` - has the route of the project.
-  `styles` - has the css files that the project uses.
-  `utils` - has the helper functions that is used throughout project.

With the help of `tsconfig.json`, we are able to use aliases for our directories.
We can simply use `@/{folderInSRC}` for accessing folders or files under the `frontend/src` directory.
This makes it easy for us as we don't need to do `../../../../folder` just to navigate through the directory.

![image](https://github.com/SPARCS-UP-Mindanao/SPARCS-Event-Platform/assets/85269524/08d2ed2c-84b7-4a93-a110-0bf5af71d4dc)

## Styling guide

Our project has a design system. You can view it [here](https://www.figma.com/file/F2HfagNiajlBmN4vDXvqg1/SPARCS-Ticket-%26-Certificate-System?type=design&node-id=0-1&mode=design&t=WFJeam4Qa4DSPi6F-0).

Fortunately, the colors and fonts are now integrated tailwind, which makes it easy for us to style.
![image](https://github.com/SPARCS-UP-Mindanao/SPARCS-Event-Platform/assets/85269524/801c200c-22b1-4762-afd2-65dbd3d547a9)

If you're new to tailwind, you can also read about tailwind here and the cheat sheet.
- [Tailwind Docs](https://tailwindcss.com/)
- [Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

## Components
In this project, we are using shadcn/ui for our components.

You can read the docs [here](https://ui.shadcn.com/).

Some of the components have been modified to match the needs of this document.
Please view the component file or just message [Sean](https://www.facebook.com/seangaaab) for questions.

For naming components, we will be using Pascal case. Example: `PascalCase.tsx`

Reminder: We are using a different directory than what is written in the shadcn/ui docs. Please use `@/components/{componentName.tsx}` when importing components.

## Hooks
These contain the logic for most pages like handling forms. We can use this to separate the design from its logic. 
Usually, these hooks return functions or variables needed to apply the logic to our design.
You can read more about it [here](https://react.dev/learn/reusing-logic-with-custom-hooks).

For naming hooks, we will use Camel case with the starting word `use`. Example: `useCamelCase`

## Code formatting
Please use `prettier` for formatting code to make it look cleaner. 

You can find it as an extension in `VSCode`

##

You can always refer to the existing code to follow our best practices.

When in doubt, please feel free to ask.

##

**Your brother in Christ,**

**Sean**
