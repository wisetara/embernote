import Ember from 'ember';
import { get } from '@ember/object';

export default Ember.Component.extend({
  actions: {
    saveNote: function() {
      get(this, 'note').save();
    },
    closeNote: function() {
      // This is totes an anti-pattern, but I can fix this up later, I reckon.
      this.sendAction('close');
    },
  },
});
