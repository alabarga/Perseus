from cdm_souffleur.model.conceptVocabularyModel import *
import math
import numpy as np
from itertools import groupby
from cdm_souffleur.utils.constants import VOCABULARY_FILTERS

def search_vocabulary_concepts(pageSize, page, query):
    offset = int(page) * int(pageSize) - 1
    concepts_list = get_concepts_list(query)
    selected_concepts_indices = np.arange(offset, offset + int(pageSize))
    selected_concepts = np.take(concepts_list, selected_concepts_indices)
    vocabulary_filters = get_filters(concepts_list)
    total_records = len(concepts_list)
    total_pages = math.ceil(total_records/int(pageSize))

    search_result = {'content': list(selected_concepts), 'facets': vocabulary_filters, 'totalElements': total_records, 'totalPages': total_pages}

    return search_result


def get_concepts_list(query):
    concepts_query = Concept.select().where(Concept.concept_name.contains(query))
    result_concepts = []
    for item in concepts_query:
        concept = {'id': item.concept_id,
                   'code': item.concept_code,
                   'name': item.concept_name,
                   'className': item.concept_class_id,
                   'standardConcept': "Standard" if item.standard_concept == "S" else "Classification" if item.standard_concept == "C" else "Non-standard",
                   'invalidReason': "Invalid" if item.invalid_reason else "Valid",
                   'domain': item.domain_id,
                   'vocabulary': item.vocabulary_id}
        result_concepts.append(concept)

    return result_concepts


def get_filters(concepts):
    filter_queries = {'concept_class_id': Concept_Class.select(Concept_Class.concept_class_id),
                      'domain_id': Domain.select(Domain.domain_id),
                      'vocabulary_id': Vocabulary.select(Vocabulary.vocabulary_id)}
    filters = {}
    for key in VOCABULARY_FILTERS:
        if key in filter_queries:
            filters[key] = get_filter_values(filter_queries[key], key)
        else:
            filters[key] = {}
        filters[key] = update_filter_values(filters[key], concepts, VOCABULARY_FILTERS[key])
    return filters


def get_filter_values(query, field):
    result_values = {}
    for item in query:
        filter_key = item.concept_class_id if field == 'concept_class_id' else item.domain_id if field == 'domain_id' else item.vocabulary_id,
        result_values[filter_key[0]] = 0
    return result_values


def update_filter_values(vocab_filter, concepts, vocab_property):
    group_key = lambda a: a[vocab_property]
    groups = groupby(sorted(concepts, key=group_key), key=group_key)
    for key, group in groups:
        vocab_filter[key] = len(list(group))
    return vocab_filter
