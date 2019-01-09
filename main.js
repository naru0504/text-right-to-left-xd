const { error } = require("./lib/dialogs.js");
const { Text, RepeatGrid, Group, SymbolInstance } = require("scenegraph");
const commands = require("commands");

function textRightToLeft(selection) {
  const targets = selection.items;

  if (targets.length === 0) {
    alertNoSelection();
    return;
  }

  const unsupportedInstanceTypes = targets.filter(
    t => t instanceof RepeatGrid || t instanceof SymbolInstance
  );
  if (unsupportedInstanceTypes.length > 0) {
    alertRgSym();
    return;
  }

  const hasGroup = !!targets.find(t => t instanceof Group);

  if (hasGroup) {
    if (targets.length > 1) {
      alertGroup();
      return;
    }
  }

  const hasText = !!targets.find(t => t instanceof Text);

  if (!hasText && !hasGroup) {
    alertNoSelection();
    return;
  }

  targets.forEach(t => {
    if (t instanceof Text) {
      reverseText(t);
    } else if (t instanceof Group) {
      reverseTextInGroup(t, selection);
    }
    // else if (targets[i] instanceof RepeatGrid) {
    //   reverseTextInRepeatGrid();
    // } else if (targets[i] instanceof SymbolInstance) {
    //   reverseTextInSymbol();
    // }
  });
}

function reverseText(target) {
  target.text = target.text.split("\n").map(text => text.split("").reverse().join("")).join("\n");
}

function reverseTextInGroup(target, selection) {
  let array = [];
  const groupNum = target.children.length;
  const groupName = target.name;
  for (let i = 0; i < groupNum; i++) {
    array.push(target.children.at(i));
  }
  commands.ungroup();
  for (let j = 0; j < array.length; j++) {
    reverseText(array[j]);
  }
  commands.group();
  selection.items[0].name = groupName;
}

function reverseTextInRepeatGrid(target) {
  // work in progress
}

function reverseTextInSymbol(target) {
  // work in progress
}

function alertRgSym() {
  error("Ooops", "Symbols and Repeat Grids are not supported yet");
}

function alertGroup() {
  error(
    "Ooops",
    "If you change text direction in Group, please select one by one."
  );
}

function alertNoSelection() {
  error("Ooops!", "You need to select at least one text.");
}

module.exports = {
  commands: {
    myPluginCommand: textRightToLeft
  }
};
