'use client';

import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';

const data = [
  {
    iconSource: RocketLaunchOutlinedIcon,
    title: 'Fácil de Usar',
    desc: 'Interface intuitiva para você começar a trabalhar em poucos minutos, sem complicações',
  },
  {
    iconSource: RocketLaunchOutlinedIcon,
    title: 'Fácil de Usar',
    desc: 'Interface intuitiva para você começar a trabalhar em poucos minutos, sem complicações',
  },
  {
    iconSource: RocketLaunchOutlinedIcon,
    title: 'Fácil de Usar',
    desc: 'Interface intuitiva para você começar a trabalhar em poucos minutos, sem complicações',
  },
  {
    iconSource: RocketLaunchOutlinedIcon,
    title: 'Fácil de Usar',
    desc: 'Interface intuitiva para você começar a trabalhar em poucos minutos, sem complicações',
  },
  {
    iconSource: RocketLaunchOutlinedIcon,
    title: 'Fácil de Usar',
    desc: 'Interface intuitiva para você começar a trabalhar em poucos minutos, sem complicações',
  },
  {
    iconSource: RocketLaunchOutlinedIcon,
    title: 'Fácil de Usar',
    desc: 'Interface intuitiva para você começar a trabalhar em poucos minutos, sem complicações',
  },
];

export default function ChildMotivos() {
  return (
    <>
      <div>
        <h2>Por que escolher o Plics SW?</h2>
        <span>
          A Plics SW reúne ferramentas que simplificam a rotina da sua empresa,
          proporcionando mais agilidade, organização e controle em um único
          sistema.
        </span>
      </div>

      <div className='cards-wrapper'>
        {data.map((v, key) => {
          const Icon = v.iconSource;

          return (
            <div key={key} className='card-motivo'>
              <Icon fontSize='large' color='primary' />
              <span>{v.title}</span>
              <span>{v.desc}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
