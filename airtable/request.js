/* eslint no-restricted-imports: 0 */
/* eslint-disable no-unused-vars */

/*
  THIS IS A GENERATED FILE
  Changes might be overwritten in the future, edit with caution!

  Wrapper functions around functions in airtable.js that interact with Airtable, designed
  to provide basic functionality

  If you're adding a new function: make sure you add a corresponding test (at least 1) for it in request.spec.js

*/

import { Tables, Columns } from './schema';
import {
  createRecord,
  updateRecord,
  getAllRecords,
  getRecordsByAttribute,
  getRecordById,
  deleteRecord
} from './airtable';

/*
 ******* CREATE RECORDS *******
 */

export const createOwner = async record => {
  return createRecord(Tables.Owner, record);
};

export const createProjectGroup = async record => {
  return createRecord(Tables.ProjectGroup, record);
};

export const createAnnouncement = async record => {
  return createRecord(Tables.Announcement, record);
};

export const createSolarProject = async record => {
  return createRecord(Tables.SolarProject, record);
};

export const createRateSchedule = async record => {
  return createRecord(Tables.RateSchedule, record);
};

export const createPledgeInvite = async record => {
  return createRecord(Tables.PledgeInvite, record);
};

export const createPayment = async record => {
  return createRecord(Tables.Payment, record);
};

export const createInvestmentBreakdown = async record => {
  return createRecord(Tables.InvestmentBreakdown, record);
};

export const createTestDevelopment = async record => {
  return createRecord(Tables.TestDevelopment, record);
};

/*
 ******* READ RECORDS *******
 */

export const getOwnerById = async id => {
  return getRecordById(Tables.Owner, id);
};

export const getOwnersByIds = async ids => {
  const formula = `OR(${ids.reduce(
    (f, id) => `${f} {ID}='${id}',`,
    ''
  )} 1 < 0)`;
  return getAllRecords(Tables.Owner, formula);
};

export const getAllOwners = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.Owner, filterByFormula, sort);
};

export const getOwnersByEmail = async (value, sort = []) => {
  return getRecordsByAttribute(
    Tables.Owner,
    Columns[Tables.Owner].email.name,
    value,
    sort
  );
};

export const getProjectGroupById = async id => {
  return getRecordById(Tables.ProjectGroup, id);
};

export const getProjectGroupsByIds = async ids => {
  const formula = `OR(${ids.reduce(
    (f, id) => `${f} {ID}='${id}',`,
    ''
  )} 1 < 0)`;
  return getAllRecords(Tables.ProjectGroup, formula);
};

export const getAllProjectGroups = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.ProjectGroup, filterByFormula, sort);
};

export const getPledgeInviteById = async id => {
  return getRecordById(Tables.PledgeInvite, id);
};

export const getPledgeInvitesByIds = async ids => {
  const formula = `OR(${ids.reduce(
    (f, id) => `${f} {ID}='${id}',`,
    ''
  )} 1 < 0)`;
  return getAllRecords(Tables.PledgeInvite, formula);
};

export const getAllPledgeInvites = async (filterByFormula = '', sort = []) => {
  return getAllRecords(Tables.PledgeInvite, filterByFormula, sort);
};

export const getTestDevelopmentById = async id => {
  return getRecordById(Tables.TestDevelopment, id);
};

export const getTestDevelopmentsByIds = async ids => {
  const formula = `OR(${ids.reduce(
    (f, id) => `${f} {ID}='${id}',`,
    ''
  )} 1 < 0)`;
  return getAllRecords(Tables.TestDevelopment, formula);
};

export const getAllTestDevelopments = async (
  filterByFormula = '',
  sort = []
) => {
  return getAllRecords(Tables.TestDevelopment, filterByFormula, sort);
};

/*
 ******* UPDATE RECORDS *******
 */

export const updateOwner = async (id, recordUpdates) => {
  return updateRecord(Tables.Owner, id, recordUpdates);
};

export const updateProjectGroup = async (id, recordUpdates) => {
  return updateRecord(Tables.ProjectGroup, id, recordUpdates);
};

export const updateAnnouncement = async (id, recordUpdates) => {
  return updateRecord(Tables.Announcement, id, recordUpdates);
};

export const updatePledgeInvite = async (id, recordUpdates) => {
  return updateRecord(Tables.PledgeInvite, id, recordUpdates);
};

export const updateTestDevelopment = async (id, recordUpdates) => {
  return updateRecord(Tables.TestDevelopment, id, recordUpdates);
};

/*
 ******* DELETE RECORDS *******
 */

export const deleteOwner = async id => {
  return deleteRecord(Tables.Owner, id);
};
export const deleteProjectGroup = async id => {
  return deleteRecord(Tables.ProjectGroup, id);
};
export const deleteAnnouncement = async id => {
  return deleteRecord(Tables.Announcement, id);
};
export const deletePledgeInvite = async id => {
  return deleteRecord(Tables.PledgeInvite, id);
};
export const deleteTestDevelopment = async id => {
  return deleteRecord(Tables.TestDevelopment, id);
};
