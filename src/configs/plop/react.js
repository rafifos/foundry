import { relative, join } from 'path';

export default plop => {
  const pascalCase = plop.getHelper('pascalCase');

  const ERRORS = {
    INVALID_COMPONENT_TYPE: (type, supportedTypes) => [
      `We don't support "${type}" components, sorry.`,
      `You may try one of: ${pascalCase(supportedTypes.join(', '))}, instead.`
    ],
    INVALID_FILE_TYPE: file =>
      `We don't have templates for "${file}" files, 😞.`,
    INVALID_DESTINATION: path =>
      `We couldn't find the destination folder ${path} in your project, 🤷.`
  };

  const COMPONENT_TYPES = {
    STYLED: 'styled',
    FUNCTIONAL: 'functional',
    STATEFUL: 'stateful'
  };

  const COMPONENT_FILES = {
    COMPONENT: 'component',
    COMPONENT_SPEC: 'component-spec',
    STORY: 'story',
    SERVICE: 'service',
    SERVICE_SPEC: 'service-spec'
  };

  const TEMPLATE_DIR = `${__dirname}/plop-templates`;

  const raiseErrorAndExit = message => {
    // eslint-disable-next-line no-console
    console.error([message, 'Please try again. 👋'].join(' '));
    process.exit(1);
  };

  const getComponentTemplateName = type => {
    switch (type) {
      case COMPONENT_TYPES.STYLED:
        return 'styled-component.js';
      case COMPONENT_TYPES.FUNCTIONAL:
        return 'functional-component.js';
      case COMPONENT_TYPES.STATEFUL:
        return 'stateful-component.js';
      default:
        return raiseErrorAndExit(ERRORS.INVALID_COMPONENT_TYPE);
    }
  };

  const getFileName = (file, name) => {
    const fileNameMap = {
      [COMPONENT_FILES.COMPONENT]: `${name}.js`,
      [COMPONENT_FILES.COMPONENT_SPEC]: `${name}.spec.js`,
      [COMPONENT_FILES.STORY]: `${name}.story.js`,
      [COMPONENT_FILES.SERVICE]: `${name}Service.js`,
      [COMPONENT_FILES.SERVICE_SPEC]: `${name}Service.spec.js`
    };
    return fileNameMap[file];
  };

  /**
   * Generating React components and
   */
  plop.setGenerator('component', {
    description: 'React component',
    prompts: [
      // Component name
      {
        type: 'input',
        name: 'name',
        message: "What's the name of your component?"
      },
      // Component type
      {
        type: 'list',
        name: 'type',
        message: 'What type of component do you need?',
        choices: [
          {
            name: 'Styled',
            value: COMPONENT_TYPES.STYLED
          },
          {
            name: 'Functional',
            value: COMPONENT_TYPES.FUNCTIONAL
          },
          {
            name: 'Stateful',
            value: COMPONENT_TYPES.STATEFUL
          }
        ],
        default: 'functional'
      },
      // Get the path
      {
        type: 'input',
        name: 'destinationPath',
        message: 'Where would you like to put your component?',
        default: relative(
          process.cwd(),
          `${plop.getPlopfilePath()}/src/components`
        )
      },
      // Files
      {
        type: 'checkbox',
        name: 'files',
        message: 'Which files does your component need?',
        choices: [
          {
            name: 'Component',
            value: COMPONENT_FILES.COMPONENT,
            checked: true
          },
          {
            name: 'Component spec',
            value: COMPONENT_FILES.COMPONENT_SPEC,
            checked: true
          },
          {
            name: 'Story',
            value: COMPONENT_FILES.STORY,
            checked: false
          },
          {
            name: 'Service',
            value: COMPONENT_FILES.SERVICE,
            checked: false
          },
          {
            name: 'Service spec',
            value: COMPONENT_FILES.SERVICE_SPEC,
            checked: false
          }
        ]
      }
    ],
    actions: ({ name, type, files, destinationPath }) => {
      const absDestinationPath = `${plop.getPlopfilePath()}/${destinationPath}`;
      const capitalizedName = pascalCase(name);

      const actions = files.reduce((acc, file) => {
        if (!Object.values(COMPONENT_FILES).includes(file)) {
          raiseErrorAndExit(ERRORS.INVALID_FILE);
        }

        const templateFileName =
          file === COMPONENT_FILES.COMPONENT
            ? getComponentTemplateName(type)
            : `${file}.js`;

        return acc.concat({
          type: 'add',
          path: join(
            absDestinationPath,
            capitalizedName,
            getFileName(file, name)
          ),
          templateFile: join(TEMPLATE_DIR, 'react', templateFileName)
        });
      }, []);

      return actions;
    }
  });

  /**
   * Generating a Ladda API.
   */
  // plop.setGenerator('api', {
  //   description: 'Ladda API',
  //   prompts: [
  //     {
  //       type: 'input',
  //       name: 'name',
  //       message: "What's the name of your API?"
  //     }
  //   ],
  //   actions: [
  //     {
  //       type: 'add',
  //       path: 'src/{{name}}.js',
  //       templateFile: 'plop-templates/controller.hbs'
  //     }
  //   ]
  // });
};
