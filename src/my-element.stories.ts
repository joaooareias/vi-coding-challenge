import { html, TemplateResult } from 'lit';
import type { StoryFn } from '@storybook/web-components';
import './my-element'; // Import to register the component

export default {
  title: 'Components/MyElement',
  component: 'my-element',
  argTypes: {
    docsHint: { control: 'text' },
    count: { control: 'number' },
  },
};

// Define the type of arguments that the Template function will accept
interface MyElementProps {
  docsHint: string;
  count: number;
}

/**
 * Template to create a Storybook story instance of the MyElement component.
 */
const Template = ({ docsHint, count }: MyElementProps): TemplateResult => html`
  <my-element .docsHint=${docsHint} .count=${count}></my-element>
`;

// Define each story with explicit Story typing
export const Default: StoryFn<MyElementProps> = Template.bind({});
Default.args = {
  docsHint: 'Click on the Vite and Lit logos to learn more',
  count: 0,
};

export const CustomHint: StoryFn<MyElementProps> = Template.bind({});
CustomHint.args = {
  docsHint: 'This is a custom hint for documentation!',
  count: 0,
};

export const InitialCount: StoryFn<MyElementProps> = Template.bind({});
InitialCount.args = {
  docsHint: 'Click the button to increase the count',
  count: 5,
};
