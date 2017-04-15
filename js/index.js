function getJson(url) {
  return JSON.parse($.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    global: false,
    async: false,
    success: function(data) {
      return data;
    }
  }).responseText);
}

var elements = getJson("https://gist.githubusercontent.com/peterellisjones/758549cd18d4665163d8774e6bea6f6b/raw/a3f2b8abb87c8baabd099f658483b5617e9c3f59/Periodic%2520Table%2520Elements%2520JSON%2520Format");
var mass = 0;
var found = false;

$("#submit").click(function() {
  let loc = $("#molecule");
  let mol = loc.val();
  if (mol !== '') {
    $("#instructions").remove();
    let finalMass = search(mol);
    $("#response").html(mol + " weighs " + finalMass + " g/mol");
    loc.val("");
  }
});

function search(mol) {
  mass = 0;
  for (var i = 0; i < mol.length; i++) {
    if (i < mol.length - 1) {
      i += notLast(mol, i);
    } else {
      letter(mol, i);
    }
  }
  return mass;
}

function notLast(mol, i) {
  found = false;
  if (mol[i] == "(") {
    var otherParen = mol.search("\\)");
    mass += search(mol.slice(i + 1, otherParen)) * parseInt(mol[otherParen + 1]);
    return otherParen - mol.search("\\(");
  }
  if ($.isNumeric(mol[i + 1])) {
    if ($.isNumeric(mol[i + 2])) {
      letterNumberNumber(mol, i);
      return 2;
    }
    letterNumber(mol, i);
    return 1;
  } else if ($.isNumeric(mol[i + 2]) && mol[i + 1] == mol[i + 1].toLowerCase()) {
    if ($.isNumeric(mol[i + 3])) {
      twoLettersNumberNumber(mol, i);
      return 3;
    }
    twoLettersNumber(mol, i);
    return 2;
  }
  if (mol[i + 1] == mol[i + 1].toLowerCase()) {
    twoLetters(mol, i);
    return 1;
  }
  letter(mol, i);
  return 0;
}

function letter(mol, num) {
  return periodic(mol[num].toUpperCase(), num, 1);
}

function letterNumber(mol, num) {
  return periodic(mol[num].toUpperCase(), num, parseInt(mol[num + 1]));
}

function letterNumberNumber(mol, num) {
  return periodic(mol[num].toUpperCase(), num, parseInt(mol.slice(num + 1, num + 3)));
}

function twoLetters(mol, num) {
  return periodic(mol[num] + mol[num + 1], num, 1);
}

function twoLettersNumber(mol, num) {
  return periodic(mol[num] + mol[num + 1], num, parseInt(mol[num + 2]));
}

function twoLettersNumberNumber(mol, num) {
  return periodic(mol[num] + mol[num + 1], num, parseInt(mol.slice(num + 2, num + 4)));
}

function periodic(sym, num, times) {
  for (var x in elements) {
    if (elements[x].abbreviation === sym) {
      mass += elements[x].atomic_weight * times;
      return true;
    }
  }
  return false;
}