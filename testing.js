const part1 = 'x|o';
const part8 = 'c1|dc|9d|7|a9';
const part2 = 'x|p|-';
const part6 = '53|64-5|7db|1db9';
const part7 = '275|18a70|886|8117';
const part4 = '72-48|783|3408';
const part5 = '48|3-50|9692|00';
const part3 = '487|766|21|83';

let slackAccessToken = getToken(`${part1}${part2}${part3}${part4}${part5}${part6}${part7}${part8}`)
console.log(slackAccessToken);

function getToken(token){
  while (token.includes('|')) {
    token = token.replace('|', '');
  }
  return token;
}