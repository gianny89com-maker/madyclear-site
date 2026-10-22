import test from 'node:test';
import assert from 'node:assert/strict';
import {sendFormEmail, ENDPOINT} from '../assets/form-email.mjs';

const payload = {first_name:'TEST TECHNIQUE',phone:'0000000000',summary:'TEST — aucune prestation',source_channel:'test'};
const options = {origin:'https://www.madyclear.fr'};
const saved = body => ({ok:true,json:async()=>({ok:true,reference:'MC-'+JSON.parse(body).submission_id.toUpperCase(),notification_status:'queued'})});

test('saving succeeds while email is still queued; the browser only calls capture', async()=>{
  let calls=0;
  const result=await sendFormEmail(payload,{...options,fetchImpl:async(url,init)=>{
    calls++; assert.equal(url,ENDPOINT); assert(!url.includes('formsubmit')); return saved(init.body);
  }});
  assert.equal(calls,1); assert.equal(result.ok,true); assert.equal(result.notificationStatus,'queued');
});
test('retry after a lost response keeps the same submission ID',async()=>{
  let first;
  await assert.rejects(sendFormEmail(payload,{...options,fetchImpl:async(url,init)=>{first=JSON.parse(init.body).submission_id;throw new Error('connection lost');}}));
  await sendFormEmail(payload,{...options,fetchImpl:async(url,init)=>{assert.equal(JSON.parse(init.body).submission_id,first);return saved(init.body);}});
});
test('an edited request gets a distinct ID',async()=>{
  const ids=[];
  for(const summary of ['Demande distincte 1','Demande distincte 2']) await sendFormEmail({...payload,summary},{...options,fetchImpl:async(url,init)=>{ids.push(JSON.parse(init.body).submission_id);return saved(init.body);}});
  assert.notEqual(ids[0],ids[1]);
});
test('an unconfirmed save is never presented as success',async()=>{
  await assert.rejects(sendFormEmail(payload,{...options,fetchImpl:async()=>({ok:true,json:async()=>({success:true})})}),/unconfirmed/);
});
test('invalid contact or origin never reaches the network',async()=>{
  const fetchImpl=async()=>assert.fail('network must not be called');
  await assert.rejects(sendFormEmail({...payload,phone:'123'},{...options,fetchImpl}),/contact/);
  await assert.rejects(sendFormEmail(payload,{origin:'https://example.com',fetchImpl}),/preview/);
});
test('rate limiting is preserved',async()=>{
  await assert.rejects(sendFormEmail(payload,{...options,fetchImpl:async()=>({ok:false,status:429})}),/rate/);
});
