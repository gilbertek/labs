import React from 'react';
import expect from 'expect';
import TestUtils from 'react-dom/test-utils';
import CourseForm from '../../../src/components/course/CourseForm';

function setup(saving) {
  const props = {
    course: {},
    saving,
    errors: {},
    onSave: () => {},
    onChange: () => {}
  };

  const renderer = TestUtils.createRenderer();
  renderer.render(<CourseForm {...props} />);
  const output = renderer.getRenderOutput();

  return {
    props,
    output,
    renderer
  };
}

describe('CourseForm via React test Utils', () => {
  it('renders form and h1', () => {
    const { output } = setup(false);
    expect(output.type).toBe('form');
    expect(output.props.children[0].type).toBe('h1');
  });

  it('save button is labelled "Save" when not saving', () => {
    const { output } = setup(false);

    const submitButton = output.props.children[5];
    expect(submitButton.props.value).toBe('Save');
  });

  it('save button is labelled "Saving..." when saving', () => {
    const { output } = setup(true);
    const submitButton = output.props.children[5];
    expect(submitButton.props.value).toBe('Saving');
  });

});


