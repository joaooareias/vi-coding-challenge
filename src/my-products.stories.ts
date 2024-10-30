import './my-products.ts';

export default {
    title: 'My Products',
    component: 'my-products',
};

const Template = () => {
    const element = document.createElement('my-products');
    return element;
};

export const FilteredList = Template.bind({});
