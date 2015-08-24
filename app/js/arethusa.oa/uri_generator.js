"use strict";

angular.module('arethusa.oa').service('uriGenerator', [
  'state',
  function(state) {
    var oa={};
    oa["@context"] = "http://www.w3.org/ns/oa-context-20130208.json";
    oa["@id"] = ref;
    oa["@type"] = "oa:Annotation";
    var d = new Date();
    oa["annotatedAt"] = d.getFullYear() + "-" + d.getMonth()
        + "-" + d.getData() + "T" + d.getHours() +
        ":" + d.getMinutes() + ":" + d.getSeconds();
    oa["dcterms:source"] = "http";
    oa["dcterms:title"] = "http";
    oa["hasBody"] = {};
    oa["hasBody"]["@id"] = "http";
    oa["hasTarget"] = {};
    oa["hasTarget"]["@id"] = "http";
    oa["hasTarget"]["@type"] = "oa:SpecificResource";
    oa["hasTarget"]["hasSelector"] = {};
    oa["hasTarget"]["hasSelector"]["@id"] = "http://data.perseus.org/collections/urn:cite:perseus";
    oa["hasTarget"]["hasSelector"]["@type"] = "oa:TextQuoteSelector";
    oa["hasTarget"]["hasSelector"]["exact"] = this.cToken;
    oa["hasTarget"]["hasSelector"]["suffix"] = state.nextToken().string;
    oa["hasTarget"]["hasSelector"]["prefix"] = state.prevToken().string;
    oa["hasTarget"]["hasSource"] = {};
    oa["hasTarget"]["hasSelector"]["@id"] = "http";
    oa["motivatedBy"] = "oa:identifying";
    oa["serializedBy"] = {};
    oa["serializedBy"]["@id"] = "http";
    oa["serializedBy"]["@type"] = "prov:SoftwareAgent";
    return oa;
  }
]);
