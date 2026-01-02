interface TagProps {
  status: 'TSA'| 'Agro' | 'GKA' | 'Buyer' | 'tsa'| 'agro' | 'gka' | 'buyer' ;
}

function Tag_Karet({ status }: TagProps) {
  let tagText = '';
  let tagColor = '';
  let textColor = '';

  if (status === 'TSA') {
    tagText = 'TSA';
    tagColor = '#FFD5D5';
    textColor = 'red';
  } else  if (status === 'Agro') {
    tagText = 'GK Agro';
    tagColor = '#FFD5D5';
    textColor = 'red';
  } else  if (status === 'GKA') {
    tagText = 'GKA';
    tagColor = '#FFFC94';
    textColor = 'orange';
  } else if (status === 'Buyer') {
    tagText = 'GKA -> Buyyer';
    tagColor = '#B5FFBC';
    textColor = 'green';
  } else if (status === 'tsa') {
    tagText = 'TSA';
    tagColor = '#FFD5D5';
    textColor = 'red';
  } else  if (status === 'agro') {
    tagText = 'GK Agro';
    tagColor = '#FFD5D5';
    textColor = 'red';
  } else  if (status === 'gka') {
    tagText = 'GKA';
    tagColor = '#FFFC94';
    textColor = 'orange';
  } else if (status === 'buyer') {
    tagText = 'GKA -> Buyyer';
    tagColor = '#B5FFBC';
    textColor = 'green';
  }

  return (
    <span style={{ backgroundColor: tagColor, color: textColor, padding: '5px 10px', borderRadius: '30px', fontSize:13 }} className="px-2 py-1 rounded-full text-xs font-semibold">
      {tagText}
    </span>
  );
}

export default Tag_Karet;